import CheckboxField from '@/components/common/Checkbox';
import { Tab, Tabs } from '@/components/common/Tab';
import styled from '@emotion/styled';
import React from 'react';

type TabSectionProps = {
  selectedIngredients: string[];
  setSelectedIngredients: React.Dispatch<React.SetStateAction<string[]>>;

  selectedOnly: boolean;

  categoryIngredientList: CategoryIngredient[];
};

const TabSection = ({
  selectedIngredients,
  setSelectedIngredients,
  categoryIngredientList,
  selectedOnly
}: TabSectionProps) => {
  // check handle
  const handleIngredientCheck = (ingredient: string) => {
    const findIngredient = selectedIngredients.find(
      (selected) => selected === ingredient
    );

    if (findIngredient)
      setSelectedIngredients((prev) =>
        prev.filter((selected) => selected !== findIngredient)
      );
    else setSelectedIngredients((prev) => [...prev, ingredient]);
  };

  const isChecked = (ingredient: string): boolean =>
    !!selectedIngredients.find((selected) => selected === ingredient);

  return (
    <TabsContainer>
      <Tabs>
        {categoryIngredientList.map((category: CategoryIngredient) => (
          <Tab key={category.category_name} title={category.category_name}>
            <TabWrapper>
              {category.ingredientNameList.map(
                (ingredient: Ingredient) =>
                  (!selectedOnly || isChecked(ingredient)) && (
                    <CheckboxFieldWrapper key={ingredient}>
                      <CheckboxField
                        name={ingredient}
                        label={ingredient}
                        checked={isChecked(ingredient)}
                        setValue={() => {
                          handleIngredientCheck(ingredient);
                        }}
                      />
                    </CheckboxFieldWrapper>
                  )
              )}
            </TabWrapper>
          </Tab>
        ))}
      </Tabs>
    </TabsContainer>
  );
};

export default TabSection;

// Tab Container
const TabsContainer = styled.div`
  min-height: auto;
  ${({ theme }) => theme.screen.tablet} {
    height: 20rem;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  overflow: scroll;
  width: 100%;
  flex-direction: column;
`;
const CheckboxFieldWrapper = styled.div`
  width: 100%;
  padding: 0.62rem 1rem;
`;
