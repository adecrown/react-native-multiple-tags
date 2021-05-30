import * as React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  showTagsWrapper: {
    minHeight: 40,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tagSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 0,
    borderRadius: 3,
    maxHeight: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#d4d5d6',
    marginBottom: 5,
  },
  showTagsContainer: {
    height: 30,
  },
  textInputStyle: {
    flex: 1,
    margin: 0,
    height: 30,
    maxHeight: 30,
    padding: 0,
    textAlignVertical: 'center',
  },
  iconStyle: {
    flex: 1,
    maxWidth: 20,
    marginRight: 5,
    textAlign: 'center',
  },
  eachTag: {
    padding: 2,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 5,
    alignItems: 'center',
    borderColor: '#d7d8d9',
  },
  eachTagIcon: {
    color: '#676869',
    marginLeft: 5,
  },
  eachTagIconAdd: {
    color: '#676869',
    marginRight: 5,
  },
  showAvailTagsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showAvailTagsViewNotFound: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
  showEachAvailTags: {
    padding: 2,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d7d8d9',
    marginBottom: 2,
    marginTop: 2,
  },
  notFoundStyle: {
    fontSize: 14,
    fontWeight: '500',
  },
  textActionBtn: {
    maxHeight: 20,
    flexDirection: 'row',
  },
  btnAction: {
    lineHeight: 20,
    justifyContent: 'flex-start',
    marginLeft: 5,
  },
  labelActiveTag: {
    fontSize: 14,
  },
});

const {
  showTagsWrapper,
  tagSearchWrapper,
  showTagsContainer,
  textInputStyle,
  iconStyle,
  textActionBtn,
  btnAction,
  labelActiveTag,
  eachTag,
  eachTagIcon,
  showAvailTagsView,
  showEachAvailTags,
  notFoundStyle,
  showAvailTagsViewNotFound,
} = styles;

interface MultipleTagProps {
  tags: string[] | object[];
  preselectedTags?: string[] | object[];
  onChangeItem: Function;
  search?: boolean;
  title?: string;
  defaultInstructionClosed?: string;
  defaultInstructionOpen?: string;
  defaultInstructionStyle?: StyleProp<TextStyle>;
  defaultTotalRenderedTags?: number;
  searchHitResponse?: string;
  sizeIconTag?: number;
  showIconAdd?: boolean;
  iconAddName?: string;
  labelActiveTag?: StyleProp<TextStyle>;
  tagActiveStyle?: StyleProp<ViewStyle>;
  visibleOnOpen?: boolean;
  objectValueIdentifier?: string;
  objectKeyIdentifier?: string;
  inputStyle: StyleProp<TextStyle>;
  placeholder?: string;
  allowCustomTags?: boolean;
}
type TagsType = (string | { [x: string]: any })[];
type ItemType = string | object;

const MultipleTags = (props: MultipleTagProps) => {
  const {
    search = true,
    title = 'Tags',
    objectKeyIdentifier = 'key',
    objectValueIdentifier = 'value',
    inputStyle,
    placeholder = 'search...',
    preselectedTags = [],
    visibleOnOpen = false,
    searchHitResponse = 'No match was found',
    defaultInstructionClosed = 'Press the down arrow button to pick a tag',
    defaultInstructionOpen = 'Pick a tag with the + icon',
    sizeIconTag = 15,
    showIconAdd = true,
    iconAddName = 'ios-add-circle-outline',
    defaultTotalRenderedTags = 30,
  } = props;

  const { width } = useWindowDimensions();
  const [tags, setTags] = React.useState<TagsType>([]);
  const [searchFilterTags, setSearchFilterTags] = React.useState<TagsType>([]);
  const [selectedTag, setSelectedTag] = React.useState<TagsType>([]);
  const [previousCharacter, setPreviousCharacter] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [totalViewWidth, setTotalViewWidth] = React.useState(0);
  const [isObject, setIsObject] = React.useState(false);
  const showAvailableTagsRef = React.useRef<FlatList<any>>(null);

  React.useEffect(() => {
    setAvailableTags();
  }, []);

  React.useEffect(() => {
    const { onChangeItem } = props;
    if (onChangeItem) onChangeItem(selectedTag);
  }, [selectedTag]);

  const setDefaultTags = () => {
    return preselectedTags.map((item: ItemType) =>
      typeof item === 'object'
        ? {
            [objectKeyIdentifier]: item[objectKeyIdentifier],
            [objectValueIdentifier]: item[objectValueIdentifier].toLowerCase(),
          }
        : item.toLowerCase()
    );
  };

  const prepareAllTags = () => {
    const { tags } = props;
    return tags.map((item: ItemType) =>
      typeof item === 'object'
        ? {
            [objectKeyIdentifier]: item[objectKeyIdentifier],
            [objectValueIdentifier]: item[objectValueIdentifier].toLowerCase(),
          }
        : item.toLowerCase()
    );
  };

  const setAvailableTags = () => {
    const { tags } = props;

    const tagIsObject = typeof tags[0] === 'object';

    const defaultTags = setDefaultTags();

    const allTags = prepareAllTags();

    let selectedTagsArray: TagsType = [];
    defaultTags.forEach((item: ItemType) => {
      const getItem = tagIsObject
        ? allTags.some(
            (x) => x[objectKeyIdentifier] === item[objectKeyIdentifier]
          )
        : allTags.includes(item);
      if (getItem) {
        selectedTagsArray.push(item);
      }
    });

    let searchFilterTagsArray: TagsType = [];
    for (let i = 0; i < selectedTagsArray.length; i += 1) {
      const item = selectedTagsArray[i];
      searchFilterTagsArray = allTags.filter((value) =>
        typeof value === 'object'
          ? value[objectKeyIdentifier] !== item[objectKeyIdentifier]
          : value !== item
      );
    }

    setSelectedTag(selectedTagsArray);
    setTags(allTags);
    setSearchFilterTags(
      searchFilterTagsArray.length ? searchFilterTagsArray : allTags
    );
    setIsObject(tagIsObject);
    setShow(visibleOnOpen);
  };

  const setTagsBasedOnQuery = (xhracter = '') => {
    setPreviousCharacter(xhracter);
    scrollToFirstItem();
  };

  const scrollToFirstItem = () => {
    if (showAvailableTagsRef && showAvailableTagsRef.current) {
      showAvailableTagsRef?.current?.scrollToOffset({
        offset: 0,
      });
    }
  };

  const ucwords = (str: string) => {
    return `${str}`.replace(/^([a-z])|\s+([a-z])/g, ($1) => $1.toUpperCase());
  };

  const eachTagWidth = (event: LayoutChangeEvent, index: number) => {
    if (index) {
      setTotalViewWidth(totalViewWidth + event.nativeEvent.layout.width);
    } else {
      setTotalViewWidth(event.nativeEvent.layout.width);
    }
  };

  const addTag = (item: ItemType) => {
    const newSearchFilterTags = searchFilterTags.filter((value) =>
      isObject
        ? value[objectValueIdentifier] !== item[objectValueIdentifier]
        : value !== item
    );
    setSearchFilterTags(newSearchFilterTags);
    setSelectedTag([item, ...selectedTag]);
  };

  const getKeyFromObject = (item: ItemType) => {
    return typeof item === 'object'
      ? ucwords(item[objectValueIdentifier])
      : ucwords(item);
  };

  const autoAddNewTag = (previousCharacter: string) => {
    const { allowCustomTags } = props;
    if (previousCharacter && allowCustomTags) {
      const isTagAlreadySelectd = selectedTag.find(
        (item) =>
          getKeyFromObject(item).toUpperCase() ===
          previousCharacter.toUpperCase()
      );
      if (!isTagAlreadySelectd) {
        if (isObject) {
          addTag({
            [objectKeyIdentifier]: previousCharacter,
            [objectValueIdentifier]: previousCharacter,
          });
        } else {
          addTag(previousCharacter);
        }
      }

      setPreviousCharacter('');
    }
  };

  const removeTag = (item: ItemType) => {
    const newSelectedTags = selectedTag.filter((value) =>
      isObject
        ? value[objectValueIdentifier] !== item[objectValueIdentifier]
        : value !== item
    );

    setSelectedTag(newSelectedTags);
    setSearchFilterTags([item, ...searchFilterTags]);
  };

  const renderItem = ({ item, index }: { item: ItemType; index: number }) => {
    const { tagActiveStyle } = props;

    return (
      <TouchableOpacity
        style={[showEachAvailTags, tagActiveStyle]}
        onLayout={(event) => eachTagWidth(event, index)}
        onPress={() => addTag(item)}
      >
        {showIconAdd && (
          <Text>
            <Icon name={iconAddName} size={sizeIconTag} />
          </Text>
        )}
        <Text style={labelActiveTag}>
          {' '}
          {typeof item === 'object'
            ? ucwords(item[objectValueIdentifier])
            : ucwords(item)}
        </Text>
      </TouchableOpacity>
    );
  };

  const showAvailableTags = () => {
    const newValue = previousCharacter.toLowerCase();
    const filteredTags: TagsType = [];

    tags.map((item) => {
      if (
        isObject
          ? item[objectValueIdentifier].includes(newValue)
          : item.includes(newValue)
      ) {
        if (
          isObject
            ? !selectedTag.some(
                (x) => x[objectValueIdentifier] === item[objectValueIdentifier]
              )
            : !selectedTag.includes(item)
        ) {
          if (filteredTags.length > defaultTotalRenderedTags) {
            return filteredTags;
          }
          filteredTags.push(item);
        }
      }
      return filteredTags;
    });

    if (filteredTags[filteredTags.length - 1] !== undefined) {
      return (
        <View style={showAvailTagsView}>
          <FlatList
            ref={showAvailableTagsRef}
            horizontal
            data={filteredTags}
            extraData={previousCharacter}
            renderItem={renderItem}
            keyExtractor={(data) =>
              isObject ? data[objectKeyIdentifier] : data
            }
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
        </View>
      );
    }

    return (
      <View style={showAvailTagsViewNotFound}>
        <Text style={notFoundStyle}>{searchHitResponse} </Text>
      </View>
    );
  };

  const renderSelectedItem = ({ item }: { item: ItemType }) => {
    return (
      <TouchableOpacity style={eachTag} onPress={() => removeTag(item)}>
        <Text>
          {typeof item === 'object'
            ? ucwords(item[objectValueIdentifier])
            : ucwords(item)}
        </Text>
        <Text style={eachTagIcon}>
          <Icon name="ios-trash-outline" size={15} />
        </Text>
      </TouchableOpacity>
    );
  };

  const showSelectedTags = () => {
    const { defaultInstructionStyle } = props;

    if (selectedTag[selectedTag.length - 1] !== undefined) {
      return (
        <FlatList
          horizontal
          data={selectedTag}
          keyExtractor={(data) => (isObject ? data[objectKeyIdentifier] : data)}
          renderItem={renderSelectedItem}
          showsHorizontalScrollIndicator={false}
        />
      );
    }

    return (
      <View style={showAvailTagsViewNotFound}>
        <Text style={[notFoundStyle, defaultInstructionStyle]}>
          {show ? defaultInstructionOpen : defaultInstructionClosed}
        </Text>
      </View>
    );
  };

  const changeVisibility = () => {
    setShow(!show);
  };

  return (
    <View>
      <View style={textActionBtn}>
        <Text onPress={changeVisibility}>{title} </Text>
        <Pressable onPress={changeVisibility} style={btnAction}>
          <Icon
            style={iconStyle}
            size={20}
            name={show ? 'arrow-up-outline' : 'arrow-down-outline'}
          />
        </Pressable>
      </View>
      <View style={showTagsWrapper}>{showSelectedTags()}</View>
      {!show || (
        <View>
          {!search || (
            <View style={tagSearchWrapper}>
              <TextInput
                style={[textInputStyle, inputStyle]}
                value={previousCharacter}
                underlineColorAndroid="transparent"
                onChangeText={(value) => setTagsBasedOnQuery(value)}
                placeholder={placeholder}
                onSubmitEditing={() => autoAddNewTag(previousCharacter)}
              />
              <Icon style={iconStyle} size={15} name="ios-search-outline" />
            </View>
          )}

          {searchFilterTags.length === 0 || (
            <View style={showTagsContainer}>{showAvailableTags()}</View>
          )}
        </View>
      )}
    </View>
  );
};

export default MultipleTags;
